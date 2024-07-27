import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRuler, faHeartPulse, faWeightScale, faCubesStacked, faBottleWater, faPersonWalking, faBed, faUtensils, faFire, faDumbbell } from '@fortawesome/free-solid-svg-icons'

export const icons = {
    "Blood_Pressure_Diastolic": <FontAwesomeIcon icon={faHeartPulse} />,
    "Blood_Pressure_Systolic": <FontAwesomeIcon icon={faHeartPulse} />,
    "Sugar_Level": <FontAwesomeIcon icon={faCubesStacked} />,
    "Water_Intake": <FontAwesomeIcon icon={faBottleWater} />,
    "Steps_Count": <FontAwesomeIcon icon={faPersonWalking} />,
    "Sleep_Hours": <FontAwesomeIcon icon={faBed} />,
    "Weight": <FontAwesomeIcon icon={faWeightScale} />,
    "Height": <FontAwesomeIcon icon={faRuler} />,
    "Calories_Intake": <FontAwesomeIcon icon={faUtensils} />,
    "Calories_Burned": <FontAwesomeIcon icon={faFire} />,
    "BMI": <FontAwesomeIcon icon={faDumbbell} />
}
