'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import DirectusImage from '../shared/DirectusImage';
import './news-dialog.css';

interface NewsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	news: any;
}

export default function NewsDialog({ isOpen, onClose, news }: NewsDialogProps) {
	if (!news) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				{/* Custom close button positioned in the corner of the dialog */}
				<div className="absolute right-4 top-4">
					<DialogClose asChild>
						<button className="rounded-full p-1.5 bg-white/80 text-primary hover:bg-primary/10 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
							<X className="h-5 w-5" />
							<span className="sr-only">Close</span>
						</button>
					</DialogClose>
				</div>
				<DialogHeader>
					<DialogTitle className="text-xl md:text-2xl font-semibold text-primary">{news.title}</DialogTitle>
				</DialogHeader>
				<div className="mt-4">
					{news.thumbnail && (
						<div className="w-full h-[200px] md:h-[300px] overflow-hidden rounded-lg mb-4">
							<DirectusImage uuid={news.thumbnail} alt={news.title} className="w-full h-full object-cover" />
						</div>
					)}
					<div className="text-sm md:text-base text-gray-700 mb-4">{news.description}</div>
					{news.content && <div className="prose max-w-none news-content-wrapper" dangerouslySetInnerHTML={{ __html: news.content }} />}
				</div>
			</DialogContent>
		</Dialog>
	);
}
