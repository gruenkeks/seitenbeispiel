import StandaloneWebsite from '@/components/website/StandaloneWebsite';

export default function PreviewPage() {
  return (
    <>
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <StandaloneWebsite enableConfigFetch={false} />
    </>
  );
}
