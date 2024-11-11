export type Title = {
  id: string;
  type: "title";
  title: string;
  outlined: boolean;
};

export type SubTitle = {
  id: string;
  type: "subTitle";
  subTitle: string;
  outlined: boolean;
};

export type Paragraph = {
  id: string;
  type: "paragraph";
  paragraph: string;
  outlined: boolean;
};

export type Image = {
  id: string;
  type: "image";
  imageUrl: string;
  outlined: boolean;
};

export type Video = {
  id: string;
  type: "video";
  video: string;
  outlined: boolean;
};

export type List = {
  id: string;
  type: "list";
  list: string[];
  outlined: boolean;
};

export type Link = {
  id: string;
  type: "link";
  link: string;
  outlined: boolean;
};

export type PostItems =
  | Title
  | SubTitle
  | Paragraph
  | Image
  | Video
  | List
  | Link;

export type BlogPost = {
  id: string;
  title: string;
  header: string;
  category: ("" | "edzés" | "versenyfelkészülés" | "regeneráció" | "étrend")[]; // Allow multiple values
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  postItems: string;
  _id?: string;
  isPublished: boolean;
};
