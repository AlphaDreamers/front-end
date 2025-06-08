export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface FaqPageSearchParams {
  q?: string;
  page?: string;
}
