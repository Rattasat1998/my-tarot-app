import { useEffect } from 'react';

export const usePageTitle = (title) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = `${title} | ศาสตร์ดวงดาว`;

        return () => {
            document.title = prevTitle;
        };
    }, [title]);
};
