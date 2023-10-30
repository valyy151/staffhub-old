import NextNProgress from "nextjs-progressbar";

export default function ProgressBar() {
  return (
    <NextNProgress
      color="#0284c7"
      showOnShallow={false}
      options={{
        showSpinner: false,
      }}
    />
  );
}
