import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Link from "next/link";
import { components } from "@/types/swagger-types";
import { Slide } from "@/components/slide";
import { getArticlesImage } from "./get-articles-images";

interface ArticlesCarouselProps {
  articles: components["schemas"]["ExtendedProjectGetDto"][];
}

export const ArticlesCarousel = async ({ articles }: ArticlesCarouselProps) => {
  let imagePaths: Pick<
    components["schemas"]["ProjectAsset"],
    "path" | "projectId"
  >[] = [];
  if (
    articles.length > 0 &&
    articles[0]?.projectAssets &&
    articles[0].projectAssets.length > 0
  ) {
    imagePaths = articles.map((project) => ({
      path: project.projectAssets?.[0].path ?? "",
      projectId: project.id ?? 0,
    }));
  } else {
    imagePaths = await getArticlesImage();
  }

  return (
    <Carousel
      className="w-full md:w-3xl xl:w-7xl"
      opts={{ loop: true, align: "start" }}
    >
      <CarouselContent>
        {articles.map((article) => {
          const image = imagePaths.find((img) => img.projectId === article.id);
          return (
            <CarouselItem
              key={article.id}
              className="md:basis-1/2 xl:basis-1/3"
            >
              <Link href={`/project/${article.slug}`}>
                <Slide
                  id={article.id ?? 0}
                  title={article.title ?? "Untitled Project"}
                  description={article.description ?? "No description"}
                  imagePath={image?.path}
                />
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};
