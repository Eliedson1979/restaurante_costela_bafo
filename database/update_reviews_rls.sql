CREATE POLICY "Users can update their own reviews." ON public.reviews
  FOR UPDATE USING (true) WITH CHECK (true);
