export type Pin = {
    id: string;
    title: string;
    description: string;
    image: string;
    userId: string;
    link: string;
    user: {
      id: string;
      name: string;
      username: string;
      image?: string;
    };
    comments: {
      id: string;
      comment: string;
      pinId: string;
      userId: string;
    }[];
  }