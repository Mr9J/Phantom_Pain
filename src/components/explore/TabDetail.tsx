function TabDetails({ detailContents }: { detailContents: string }) {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: detailContents }} />
    </>
  );
}

export default TabDetails;
