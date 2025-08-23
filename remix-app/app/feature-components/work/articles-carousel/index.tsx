import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Link from "next/link";
import { getArticlesImage } from "./get-articles-images";

import type { SupabaseClient } from "@supabase/supabase-js";
import { Tables } from "@/types/database.types";
import { Slide } from "@/components/slide";

interface ArticlesCarouselProps {
  articles: Pick<Tables<"articles">, "id" | "slug" | "title" | "description">[];
  supabaseClient: SupabaseClient;
}

export const ArticlesCarousel = async ({
  articles,
  supabaseClient,
}: ArticlesCarouselProps) => {
  const articleIds = articles.map((a) => a.id);
  const imagePaths = await getArticlesImage({ articleIds, supabaseClient });

  return (
    <Carousel
      className="w-full md:w-3xl xl:w-7xl"
      opts={{ loop: true, align: "start" }}
    >
      <CarouselContent>
        {articles.map((article) => {
          const image = imagePaths.find((img) => img.article_id === article.id);
          return (
            <CarouselItem
              key={article.id}
              className="md:basis-1/2 xl:basis-1/3"
            >
              <Link href={`/project/${article.slug}`}>
                <Slide
                  id={article.id}
                  title={article.title}
                  description={article.description}
                  imagePath={image?.path}
                  supabaseClient={supabaseClient}
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
