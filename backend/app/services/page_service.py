"""
page_service.py
---------------
Business-logic layer for the `Page` resource.

All database interactions for pages go through `PageService`.
The class is stateless (no __init__ state) so it can be used as a
singleton-style dependency or instantiated inline.
"""

import logging
import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.page import Page
from app.schemas.page import PageCreate, PageUpdate

logger = logging.getLogger(__name__)


class PageService:
    """Service class encapsulating all CRUD operations for the Page model."""

    # ------------------------------------------------------------------
    # CREATE
    # ------------------------------------------------------------------

    async def create_page(
        self, db: AsyncSession, user_id: UUID, page_in: PageCreate
    ) -> Page:
        """
        Create a new page for a given user.

        The caller is responsible for verifying that the slug does not
        already exist before calling this method.

        Args:
            db:       Active async database session.
            user_id:  UUID of the authenticated owner.
            page_in:  Validated PageCreate payload.

        Returns:
            The newly created and persisted Page instance.
        """
        logger.info("Creating page slug='%s' for user_id='%s'", page_in.slug, user_id)

        db_page = Page(
            **page_in.model_dump(),
            user_id=user_id,
        )
        db.add(db_page)
        await db.commit()
        await db.refresh(db_page)

        logger.info("Page created successfully: id='%s'", db_page.id)
        return db_page

    # ------------------------------------------------------------------
    # READ
    # ------------------------------------------------------------------

    async def get_pages_for_user(
        self, db: AsyncSession, user_id: UUID, search: Optional[str] = None
    ) -> list[Page]:
        """
        Fetch all non-deleted pages owned by a user.

        Args:
            db:      Active async database session.
            user_id: UUID of the page owner.
            search:  Optional search string to filter by name or slug (case-insensitive).

        Returns:
            List of Page instances (may be empty).
        """
        logger.debug(
            "Fetching pages for user_id='%s' (search='%s')", user_id, search
        )

        query = select(Page).where(
            Page.user_id == user_id,
            Page.is_deleted == False,
        )

        if search and search.strip():
            term = f"%{search.strip()}%"
            query = query.where(
                Page.name.ilike(term) | Page.slug.ilike(term)
            )

        result = await db.execute(query)
        pages = list(result.scalars().all())

        logger.debug("Found %d page(s) for user_id='%s'", len(pages), user_id)
        return pages

    async def get_page_by_id(
        self,
        db: AsyncSession,
        page_id: UUID,
        user_id: UUID | None = None,
    ) -> Page | None:
        """
        Fetch a single page by its primary key.

        When `user_id` is provided the query is scoped to that owner,
        which prevents one user from reading another user's page.

        Args:
            db:      Active async database session.
            page_id: UUID of the target page.
            user_id: Optional UUID to scope the query to an owner.

        Returns:
            Page instance if found, otherwise None.
        """
        logger.debug(
            "Fetching page id='%s' (user_id filter='%s')", page_id, user_id
        )

        query = select(Page).where(
            Page.id == page_id,
            Page.is_deleted == False,
        )
        if user_id:
            query = query.where(Page.user_id == user_id)

        result = await db.execute(query)
        page = result.scalar_one_or_none()

        if not page:
            logger.debug("Page id='%s' not found.", page_id)
        return page

    async def get_page_by_slug(
        self, db: AsyncSession, slug: str
    ) -> Page | None:
        """
        Fetch a page by its public URL slug.

        Used by both the public viewer endpoint (no auth) and the
        slug-uniqueness check before creating / updating a page.

        Args:
            db:   Active async database session.
            slug: The URL-safe string identifier.

        Returns:
            Page instance if found, otherwise None.
        """
        logger.debug("Fetching page by slug='%s'", slug)

        result = await db.execute(
            select(Page).where(
                Page.slug == slug,
                Page.is_deleted == False,
            )
        )
        return result.scalar_one_or_none()

    # ------------------------------------------------------------------
    # UPDATE
    # ------------------------------------------------------------------

    async def update_page(
        self,
        db: AsyncSession,
        page_id: UUID,
        user_id: UUID,
        page_in: PageUpdate,
    ) -> Page | None:
        """
        Partially update a page owned by the given user.

        Only fields explicitly provided in `page_in` are updated
        (i.e. `exclude_unset=True` is used), leaving the rest intact.

        Args:
            db:      Active async database session.
            page_id: UUID of the page to update.
            user_id: UUID of the owner (used to scope the lookup).
            page_in: Validated PageUpdate payload.

        Returns:
            Updated Page instance, or None if the page was not found.
        """
        logger.info("Updating page id='%s' for user_id='%s'", page_id, user_id)

        db_page = await self.get_page_by_id(db, page_id, user_id)
        if not db_page:
            logger.warning(
                "Update failed – page id='%s' not found for user_id='%s'",
                page_id,
                user_id,
            )
            return None

        update_data = page_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_page, key, value)

        await db.commit()
        await db.refresh(db_page)

        logger.info("Page id='%s' updated successfully.", page_id)
        return db_page

    # ------------------------------------------------------------------
    # DELETE (soft-delete)
    # ------------------------------------------------------------------

    async def delete_page(
        self, db: AsyncSession, page_id: UUID, user_id: UUID
    ) -> bool:
        """
        Soft-delete a page by setting `is_deleted = True`.

        The row is retained in the database for audit / recovery purposes.
        All read queries filter on `is_deleted == False`, so the page
        becomes invisible to all normal operations immediately.

        Args:
            db:      Active async database session.
            page_id: UUID of the page to delete.
            user_id: UUID of the owner (used to scope the lookup).

        Returns:
            True if the page was found and marked deleted, False otherwise.
        """
        logger.info(
            "Soft-deleting page id='%s' for user_id='%s'", page_id, user_id
        )

        db_page = await self.get_page_by_id(db, page_id, user_id)
        if not db_page:
            logger.warning(
                "Delete failed – page id='%s' not found for user_id='%s'",
                page_id,
                user_id,
            )
            return False

        db_page.is_deleted = True
        db_page.deleted_at = datetime.datetime.now(datetime.timezone.utc)
        await db.commit()

        logger.info("Page id='%s' soft-deleted successfully.", page_id)
        return True


# ---------------------------------------------------------------------------
# Module-level singleton – import and use this in route handlers.
# ---------------------------------------------------------------------------
page_service = PageService()
