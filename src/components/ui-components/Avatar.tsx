// TYPES
interface AvatarProps {
    text: string;
    height?:number;
    width?:number;
}
const Avatar = (props: AvatarProps) => {
    const { text ,height = 30,width=30} = props;
    return (
        <>
            <div style={{height:height,width:width}} className="bg-secondary-v10 rounded-full flex items-center justify-center">
                <span className="text-base text-heading font-bold">
                    {text?.charAt(0)?.toUpperCase() || ''}
                </span>
            </div>
        </>
    );
};

export default Avatar;
