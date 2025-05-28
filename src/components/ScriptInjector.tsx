'use client';

import { useEffect } from 'react';

interface ScriptInjectorProps {
	headerCode?: string;
	bodyCode?: string;
}

/**
 * Component that injects custom code into the head and body of the document
 * This uses direct DOM manipulation to ensure the code is properly injected
 */
export default function ScriptInjector({ headerCode, bodyCode }: ScriptInjectorProps) {
	useEffect(() => {
		// Inject header code
		if (headerCode) {
			// Create a container for the header code
			const headerContainer = document.createElement('div');
			headerContainer.id = 'custom-header-code';
			headerContainer.innerHTML = headerCode;

			// Insert the header code into the document head
			document.head.appendChild(headerContainer);
		}

		// Inject body code
		if (bodyCode) {
			// Create a container for the body code
			const bodyContainer = document.createElement('div');
			bodyContainer.id = 'custom-body-code';
			bodyContainer.innerHTML = bodyCode;

			// Insert the body code at the end of the document body
			document.body.appendChild(bodyContainer);
		}

		// Cleanup function to remove the injected code when component unmounts
		return () => {
			if (headerCode) {
				const headerContainer = document.getElementById('custom-header-code');
				if (headerContainer) {
					document.head.removeChild(headerContainer);
				}
			}

			if (bodyCode) {
				const bodyContainer = document.getElementById('custom-body-code');
				if (bodyContainer) {
					document.body.removeChild(bodyContainer);
				}
			}
		};
	}, [headerCode, bodyCode]);

	// This component doesn't render anything visible
	return null;
}
