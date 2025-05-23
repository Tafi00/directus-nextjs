'use client';

import { cn } from '@/lib/utils';
import { setAttr } from '@directus/visual-editing';
import Text from '@/components/ui/Text';
import Image from 'next/image';
import DirectusImage from '../shared/DirectusImage';

export interface InfoBoxProps {
  data: {
    id: string;
    title: string | null;
    content: string | null;
    icon?: string | null;
    titleMobile?: string | null;
    contentMobile?: string | null;
    variant?: 'default' | 'info' | 'warning' | 'success' | 'error';
  };
  blockId: string;
  itemId?: string;
}

const InfoBox = ({ data, blockId }: InfoBoxProps) => {
  const variantStyles = {
    default: 'bg-white border-[#3D7A9E] md:border-[#C4C4C4]',
    info: 'bg-blue-50 border-blue-300',
    warning: 'bg-yellow-50 border-yellow-300',
    success: 'bg-green-50 border-green-300',
    error: 'bg-red-50 border-red-300',
  };

  const variantClass = data.variant ? variantStyles[data.variant] : variantStyles.default;

  return (
    <div 
      id={blockId} 
      className={cn('rounded-[16px] py-6 px-4 flex flex-col md:items-center text-center border', variantClass)}
    >
      <div className="flex lg:flex-col items-center text-center gap-3 lg:gap-0">
        {data.icon && (
          <DirectusImage
            uuid={data.icon}
            alt={data.title || ''}
            width={48}
            height={48}
            className="h-[36px] w-[36px] md:w-[48px] md:h-[48px] md:mb-4"
            data-directus={setAttr({
              collection: 'block_infobox',
              item: data.id,
              fields: 'icon',
              mode: 'popover',
            })}
          />
        )}
        
        {data.title && (
          <h4 
            className="text-primary text-[3.6vw] md:text-[0.92vw] font-semibold md:mb-3 text-justify lg:text-center"
            data-directus={setAttr({
              collection: 'block_infobox',
              item: data.id,
              fields: 'title',
              mode: 'popover',
            })}
          >
            <span className="hidden lg:block">
              {data.title?.split("\n")?.map((line, i) => (
                <span key={i} className="uppercase">
                  {line}
                  {i < (data.title?.split("\n")?.length ?? 0) - 1 && <br />}
                </span>
              ))}
            </span>
            <span className="block lg:hidden">
              {data.titleMobile ?? (data.title?.split("\n")?.map((line, i) => (
                <span key={i} className="uppercase">
                  {line}
                  {i < (data.title?.split("\n")?.length ?? 0) - 1 && <br />}
                </span>
              )))}
            </span>
          </h4>
        )}
      </div>

      {data.content && (
        <p 
          className="text-content text-[3.2vw] lg:text-[0.82vw] mt-2 md:mt-0 font-normal text-justify md:text-center leading-snug"
          data-directus={setAttr({
            collection: 'block_infobox',
            item: data.id,
            fields: 'content',
            mode: 'drawer',
          })}
        >
          <span className="block lg:hidden">
            {data.contentMobile ?? data.content}
          </span>
          <span className="hidden lg:block">{data.content}</span>
        </p>
      )}
    </div>
  );
};

export default InfoBox; 