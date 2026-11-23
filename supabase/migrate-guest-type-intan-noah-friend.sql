-- Run both lines in the Supabase SQL editor before importing these guest types.
alter type guest_type add value if not exists 'intan_friend';
alter type guest_type add value if not exists 'noah_friend';
