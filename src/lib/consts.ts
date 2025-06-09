import { Status } from "../store/types";

export const BOOK_STATES: Record<Status, string> = {
  'writing': 'Writing',
  'draft': 'Draft', 
  'reviewing': 'Reviewing',
  'published': 'Published',
  'archived': 'Archived',
  'error': 'Error'
};

export const TEAM_ROLES: Record<string, string> = {
  'admin': 'Admin',
  'editor': 'Editor',
  'viewer': 'Viewer'
};