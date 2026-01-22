import './Style-Location.css'
import logo_tick from '../../../assets/logo_tick.png'
import { roomLocationService } from '../../../services/roomLocationService'
import { useEffect, useState } from "react";

const Location = ({data, subjectId, isSelected, onSelect}) => {
  const [capacity, setCapacity] = useState(0);
  const [loadingCapacity, setLoadingCapacity] = useState(false);
    useEffect(() => {
    const fetchCapacity = async () => {

      try {
        setLoadingCapacity(true);
        const totalCapacity = await roomLocationService.getTotalCapacityByLocationAndSubject(
          data.id,
          subjectId
        );

        setCapacity(totalCapacity);
      } catch (error) {
        console.error("Lỗi lấy capacity:", error);
        setCapacity(0);
      } finally {
        setLoadingCapacity(false);
      }
    };

    fetchCapacity();
  }, [location?.id, subjectId]);
  return (
    <div
      className={`location ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <h5 className='location-title'>{data.name}</h5>
      <div className='location-info'>
        <span>Trạng thái:</span>
        <span className={`location-status ${data.status === "AVAILABLE" ? 'available' : "full"}`}>
          {data.status === "AVAILABLE" ? 'Còn chỗ' : 'Hết chỗ'}
        </span>
      </div>
      <div className='location-info'>
        <span>Địa chỉ:</span>
        <span>{data.address}</span>
      </div>
      <div className='location-info'>
        <span>Số chỗ hiện tại:</span>
        <span>{capacity}</span>
      </div>
      <img src={logo_tick} alt="" className={`${isSelected ? "ticked" : ''}`}/>
    </div>
  )
}

export default Location;