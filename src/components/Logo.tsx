import solfTitle from "@/imports/solftitle.png"
import solfLogo from "@/imports/solf_logo.png"

export function Mark({ size = 32 }: { size?: number }) {
  return (
    <img
      src={solfLogo}
      alt="SOLF"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  )
}

export function Wordmark({ className = '', height = 28 }: { className?: string; height?: number }) {
  return (
    <img
      src={solfTitle}
      alt="SOLF.GG"
      height={height}
      style={{ height, width: "auto", objectFit: "contain" }}
      className={className}
    />
  )
}
