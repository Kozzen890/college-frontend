import APP_TITLE from "../../appTitle";

export default function Head() {
  return (
    <>
      <title>{`Admin - ${APP_TITLE}`}</title>
      <meta name="description" content={`Dashboard Admin ${APP_TITLE}`} />
    </>
  );
}
