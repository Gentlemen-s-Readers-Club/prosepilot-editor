export const getCoverUrl = ({
    src,
    width,
}: {
    src: string;
    width?: number;
}) => {
    const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/render/image/public/covers/${src}`;
    const params = new URLSearchParams();
    
    if (width) {
        params.append('width', width.toString());
    }
    params.append('resize', 'contain');
    params.append('quality', '75');
    
    return `${baseUrl}?${params.toString()}`;
};