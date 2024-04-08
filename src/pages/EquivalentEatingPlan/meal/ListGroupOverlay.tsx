import { useCallback, useEffect, useState } from 'react';
import { useEquivalentEatingPlanStore } from '../hooks/equivalentEatingPlanStore';
import { useEquivalentEatingPlanListStore } from '../hooks/equivalentPlanListStore';
import { FoodListGroup } from '../hooks/equivalentPlanListStore/types';
import { averageCalories, averageCarbohydrate, averageFat, averageProtein } from '../modals/ModalReplacementLists/utils/MathHelpers';
import { ReplacementListFood } from '../../../types/Food';

interface Props {
  group: FoodListGroup;
}

export default function ListGroupOverlay({ group }: Props) {
  const selectedFoods = useEquivalentEatingPlanStore((state) => state.selectedFoods);
  const selectedGroup = useEquivalentEatingPlanListStore((state) => state.selectedGroup);

  const [groupFoods, setGroupFoods] = useState<ReplacementListFood[]>([]);

  const { getGroupFoods } = useEquivalentEatingPlanListStore();

  const setFoods = useCallback(async () => {
    setGroupFoods(await getGroupFoods(group.id));
  }, [getGroupFoods, group.id]);

  useEffect(() => {
    setFoods();
  }, [setFoods]);

  const parsedSelectedFoods = groupFoods.filter((food) => selectedFoods.findIndex((f) => f.idAlimento === food.id && f.grupo === group.name) !== -1);

  return (
    <div
      className={selectedGroup && group.id === selectedGroup.id ? 'position-absolute start-50 translate-middle' : 'd-none'}
      style={{ zIndex: 1, top: '-80px', left: '0', width: '500px' }}
    >
      <div className="card h-100">
        <div className="card-body row g-0 p-3">
          <div className="col-auto">
            <div className="d-inline-block d-flex">
              <div className="bg-primary sw-5 sh-5 rounded-md">
                <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                  {group.id}
                  <br />
                  Grupo
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card-body d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column justify-content-center">
                  <span className="heading stretched-link" dangerouslySetInnerHTML={{ __html: group.title }}></span>
                </div>
                <div className="col-12 d-flex">
                  <div className="col-3">
                    <div className="d-flex flex-column justify-content-center">
                      <span className="heading stretched-link text-center">
                        <h4>{averageCarbohydrate(parsedSelectedFoods)}g</h4>
                        <small>Carboidratos</small>
                      </span>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="d-flex flex-column justify-content-center">
                      <span className="heading stretched-link text-center">
                        <h4>{averageProtein(parsedSelectedFoods)}g</h4>

                        <small>Proteínas</small>
                      </span>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="d-flex flex-column justify-content-center">
                      <span className="heading stretched-link text-center">
                        <h4>{averageFat(parsedSelectedFoods)}g</h4>
                        <small>Lípideos</small>
                      </span>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="d-flex flex-column justify-content-center">
                      <span className="heading stretched-link text-center">
                        <h4>{averageCalories(parsedSelectedFoods)}g</h4>
                        <small>Calorias</small>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
