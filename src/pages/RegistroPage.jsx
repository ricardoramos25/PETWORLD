import { useNavigate } from "react-router-dom"
import Registro from "../components/Registro"

function RegistroPage() {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate("/")
  }

  const handleCambiarALogin = () => {
    navigate("/login")
  }

  return <Registro onClose={handleClose} onCambiarALogin={handleCambiarALogin} />
}

export default RegistroPage