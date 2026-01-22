import { useState, useEffect, useRef } from "react";
import { Button, ButtonSmall } from "../common/Button";
import "./BoxUser.css";
import { BiTrash, BiEdit, BiSolidUserCircle } from "react-icons/bi";
import Modal from "../common/Modal";
import api from "../../services/api";
import { formatDate } from "../../utils/dateUtils";
import { useAuth } from "../../contexts/AuthContext";

function BoxUser({ user, users, setUsers, totalUsers, setTotalUsers, onUpdate }) {
  const { user: userAuth } = useAuth();
  const [modalRmvUserIsOpen, setModalRmvUserIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const actionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setActionsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleDelete = async (userId) => {
    setIsLoading(true);

    await api
      .delete(`/users/${userId}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== userId));
        setTotalUsers(totalUsers - 1);
        setIsLoading(false);
        setModalRmvUserIsOpen(!modalRmvUserIsOpen);
      })
      .catch((error) => {
        console.error("Erro ao deletar usuários:", error);
        setIsLoading(false);
      });
  };

  const handleUpdate = (userId) => {
    onUpdate(userId);
  };

  return (
    <div className="box_user">

      <div className="box_user_inner">
        <div className="box_picture">
          <BiSolidUserCircle />
        </div>

        <div className="box_infos">
          <div className="infos">
            <div>
              <h2>{user.email}</h2>
              <span>{user.name}</span>
            </div>

            <div className="birthday">
              <span>{formatDate(user.date_of_birth)}</span>
            </div>
            <div className="actions">
              <div className="actions-dropdown" ref={actionsRef}>
               
               {userAuth?.roleId !== '3' && (
                 <ButtonSmall
                  className="actions-btn"
                  onClick={(e) => { e.stopPropagation(); setActionsOpen(!actionsOpen); }}
                >
                  Ações ▾
                </ButtonSmall>
               )}
               

                {actionsOpen && (
                  <div className="actions-menu">
                    
                    {(userAuth?.roleId === '1' || userAuth?.roleId === '2') && (
                      <>
                        <button
                          className="actions-item edit"
                          onClick={() => {
                            handleUpdate(user.id);
                            setActionsOpen(false);
                          }}
                        >
                          <BiEdit />
                          Editar
                        </button>
                      </>
                    )}

                    {userAuth?.roleId === '1' && (
                      <>
                        <button
                          className="actions-item remove"
                          onClick={() => {
                            setModalRmvUserIsOpen(true);
                            setActionsOpen(false);
                          }}
                        >
                          <BiTrash />
                          Remover
                        </button>
                      </>
                    )}

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Modal
          title="Remover"
          isOpen={modalRmvUserIsOpen}
          onClose={() => setModalRmvUserIsOpen(!modalRmvUserIsOpen)}
        >
          <p>
            Tem certeza que deseja remover o usuário <b>{user.name}</b>?
          </p>

          <Button onClick={() => handleDelete(user.id)}>
            {isLoading ? "Removendo..." : "Confirmar remoção"}
          </Button>
        </Modal>
      </div>

    </div>
  );
}

export default BoxUser;
