-- Run once in the Supabase SQL editor before importing type_guest = friend.
alter type guest_type add value if not exists 'friend';
