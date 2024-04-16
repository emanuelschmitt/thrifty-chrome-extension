type HeaderInfoProps = {
  title: string
  descripton: string
  children?: React.ReactNode
}

export const HeaderInfo = ({ title, descripton, children }: HeaderInfoProps) => {
  return (
    <div className="flex flex-col space-y-1.5 my-4 pt-2">
      <h3 className="text-base font-semibold leading-none tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground">{descripton}</p>
      <div className="mt-2">{children}</div>
    </div>
  )
}
