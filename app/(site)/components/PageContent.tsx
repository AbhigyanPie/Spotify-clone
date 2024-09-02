"use client";

import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnplay";
import {Song} from "@/types";

interface PageContentProps{
    songs?:Song[];
}
const PageContent: React.FC<PageContentProps> = ({
    songs 
}) => {
    const songList = songs || [];
    console.log("PageContent songs prop:", songs);

    const onPlay = useOnPlay(songList)

    if(!songList || songList.length === 0 ){
        return (
            <div className= "mt-4 text-neutral-400">
                No songs available.
            </div>
        );
    }
    return (
        <div
            className = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4">
                {songList.map((item) =>(
                    <SongItem
                        key = {item.id}
                        onClick = {(id:string) => onPlay(id)}
                        data={item}
                    />
                ))}
        </div>
    );
};
export default PageContent;