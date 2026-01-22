import './Style-SelectedLocation.css'
import { MdOutlineChangeCircle } from "react-icons/md"
import logo_location from '../../../assets/logo_location.png'

const SelectedLocation = ({setStep, location}) => {
  return (
    <div className='selected-location'>
      <div className='selected-location-title'>
        <img src={logo_location} alt="" />
        <span>Địa điểm thi</span>
      </div>
      <p className='selected-location-name'>{location.name}</p>
      <p>{`Địa chỉ: ${location.address}`}</p>
      <div className='change-location' onClick={() => setStep(1)}>
        <MdOutlineChangeCircle/>
        <span>Thay đổi địa điểm thi</span>
      </div>
    </div>
  )
}

export default SelectedLocation