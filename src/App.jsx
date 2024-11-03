import { BrowserRouter as Router } from 'react-router-dom';
import { Modal, Button, Card } from 'react-bootstrap';
import './App.css';
import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { doc, addDoc, collection, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function App() {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [addDocument, setAddDocument] = useState('');
  const [fetchData, setFetchData] = useState([]);
  const [editContent, setEditContent] = useState('');
  const [editId, setEditId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEditClose = () => setEditShow(false);
  const handleEditShow = (data) => {
    setEditContent(data.paragraph || '');  
    setEditId(data.id);
    setEditShow(true);
  };

  const dbref = collection(db, 'DocApp');

  const handleAdd = async () => {
    const addData = await addDoc(dbref, { title: addDocument, paragraph: '' });
    if (addData) {
      // alert("Data added successfully");
      fetch(); 
      handleClose(); 
    } else {
      alert("Error occurred!");
    }
  };

  const fetch = async () => {
    const fetchItem = await getDocs(dbref);
    const fetchDatas = fetchItem.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setFetchData(fetchDatas);
    console.log(fetchDatas);
  };

  useEffect(() => {
    fetch();
  }, []);

  const delDoc = async (id) => {
    const delref = doc(dbref, id);
    try {
      await deleteDoc(delref);
     
      fetch();
    } catch (err) {
      alert(err);
    }
  };


  const handleSave = async () => {

    if (!editId) return;
    const editRef = doc(dbref, editId);
    try {

      await updateDoc(editRef, { paragraph: editContent });
     
      setEditShow(false);
      fetch(); 
    } catch (err) {
      console.log(err);
      
    }
  };

  return (
    <Router>
      <div className="container text-center">
        <h1 className="fw-bolder  mt-5">DOCUMENT APP</h1>
        <button onClick={handleShow} className="btn btn-success fw-bolder mt-3">
        <i class="fa-solid fa-plus text-danger"></i> Add Documents
        </button>
      </div>
      <div className="container mt-5">
        <div className="row gx-4 gx-lg-5 row-cols-2 gap-4 row-cols-md-3 row-cols-xl-4 justify-content-center">
          {fetchData.map((data) => (
            <Card key={data.id} style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title className="text-success fw-bolder">{data.title}</Card.Title>
                <hr />
                
                <Card.Text dangerouslySetInnerHTML={{ __html: data.paragraph }} />
                <Button onClick={() => handleEditShow(data)} className="ms-2" variant="success">
                 <i className="fa-solid fa-edit"></i>
                </Button>
                <Button onClick={() => delDoc(data.id)} className="ms-4 bg-light" variant="danger">
                <i class="fa-solid fa-trash-can text-danger"></i>
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title >ADD  DOCUMENT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form method="POST">
            <TextField
              onChange={(e) => setAddDocument(e.target.value)}
              value={addDocument}
              className="w-100"
              variant="outlined"
              label="ADD DOCUMENT TITLE"
              type="text"
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CANCEL
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            ADD DOCUMENT
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Document - React Quill */}

      <Modal centered show={editShow} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary fw-bolder">EDIT DOCUMENT </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactQuill theme="snow" value={editContent} onChange={setEditContent} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            CANCEL
          </Button>

          <Button variant="primary" onClick={handleSave}>
            SAVE
          </Button>
        </Modal.Footer>
      </Modal>
    </Router>
  );
}

export default App;
