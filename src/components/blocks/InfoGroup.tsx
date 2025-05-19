'use client';

import { BlockInfoBox } from '@/types/directus-schema';
import InfoBox from './InfoBox';
import { setAttr } from '@directus/visual-editing';
import Tagline from '@/components/ui/Tagline';
import Headline from '@/components/ui/Headline';

export interface InfoGroupProps {
  data: {
    id: string;
    headline?: string | null;
    tagline?: string | null;
    info_boxes?: BlockInfoBox[];
  };
  blockId: string;
  itemId?: string;
}

const InfoGroup = ({ data, blockId }: InfoGroupProps) => {
  // Sắp xếp các info box theo thứ tự sort nếu có
  const sortedInfoBoxes = data.info_boxes ? 
    [...data.info_boxes].sort((a, b) => {
      return (a.sort || 0) - (b.sort || 0);
    }) : [];

  return (
    <div id={blockId} className="container mx-auto">

      
      {data.headline && (
        <Headline
          headline={data.headline}
          data-directus={setAttr({
            collection: 'block_info_group',
            item: data.id,
            fields: 'headline',
            mode: 'popover',
          })}
        />
      )}
            {data.tagline && (
        <Tagline
          tagline={data.tagline}
          data-directus={setAttr({
            collection: 'block_info_group',
            item: data.id,
            fields: 'tagline',
            mode: 'popover',
          })}
          className='mb-4 md:mb-6 md:mt-1'
        />
      )}
      
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0"
        data-directus={setAttr({
          collection: 'block_info_group',
          item: data.id,
          fields: 'info_boxes',
          mode: 'drawer',
        })}
      >
        {sortedInfoBoxes.map((infoBox) => (
          <InfoBox
            key={infoBox.id}
            data={{
              id: infoBox.id,
              title: infoBox.title || null,
              content: infoBox.content || null,
              icon: infoBox.icon || null,
              variant: infoBox.variant || "default"
            }}
            blockId={`infobox-${infoBox.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default InfoGroup; 