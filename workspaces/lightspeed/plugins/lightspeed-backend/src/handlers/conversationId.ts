/*
 * Copyright Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { randomBytes } from 'crypto';

const SESSION_ID_LENGTH = 16;
export const INVALID_FORTMAT_ERROR =
  'Invalid format: Must be in <user_id>+<session_id> format';

function generateSessionId(length = SESSION_ID_LENGTH) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  let sessionId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = bytes[i] % characters.length; // Ensures the index is within the range
    sessionId += characters[randomIndex];
  }

  return sessionId;
}

export function generateConversationId(user_id: string) {
  const session_id = generateSessionId();
  return `${user_id}+${session_id}`;
}

export function getUserId(conversation_id: string) {
  const [user_id, session_id] = conversation_id.split('+');

  // Check if both userId and sessionId are present
  if (user_id && session_id) {
    return user_id;
  }
  throw new Error(INVALID_FORTMAT_ERROR);
}

export function validateUserRequest(conversation_id: string, user_id: string) {
  const requestUserId = getUserId(conversation_id);
  if (requestUserId === user_id) {
    return;
  }
  throw new Error(
    `Invalid request: requested conversation_id: ${conversation_id} does not belong to authenticated user ${user_id}`,
  );
}
