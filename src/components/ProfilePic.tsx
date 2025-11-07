
type Props = {
	name: string
	size: number
}

const ProfilePic = ({name, size}: Props) => {
	const initial = name.charAt(0).toUpperCase() || '?'

	const style: React.CSSProperties = {
        width: `${size}rem`,
        height: `${size}rem`,
        borderRadius: "50%",
        backgroundColor: "var(--color-accent)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: `${size*0.5}rem`,
        userSelect: "none",
    };

	return (
		<div className="profile-pic" aria-label={`Profile: ${name}`} style={style}>
			<p>{ initial}</p>
		</div>
	)
}

export default ProfilePic