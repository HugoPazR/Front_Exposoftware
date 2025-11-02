import InformacionEstudiante from "./InformacionEstudiante";
import InformacionInvitado from "./InformacionInvitado";
import InformacionEgresado from "./InformacionEgresado";

function RoleSections(props) {
  const { rol } = props;

  return (
    <>
      {rol === "estudiante" && <InformacionEstudiante {...props} />}
      {rol === "invitado" && <InformacionInvitado {...props} />}
      {rol === "egresado" && <InformacionEgresado {...props} />}
    </>
  );
}

export default RoleSections;
