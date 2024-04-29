import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminFqa() {
  const [faqs, setFaqs] = useState([]);

  const fetchFaqs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      const response = await axios.get('http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/admin-seller/listFaq');
      setFaqs(response.data.faqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error.message);
      // Handle error, e.g., show error message to the user
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDelete = async (faqId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      await axios.delete(`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/admin-seller/faqDelete/${faqId}`);
      // Refresh the FAQs after successful deletion
      fetchFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error.message);
      // Handle error, e.g., show error message to the user
    }
  };

  return (
    <>
      <h1 className="text-center mb-4">Frequently Asked Questions</h1>
      <table className="table">
        <thead style={{ backgroundColor: '#7e5888' }}>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Question</th>
            <th scope="col">Answer</th>
            <th scope="col">Delete</th>
        
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq, index) => (
            <tr key={faq._id}>
              <th scope="row">{index + 1}</th>
              <td>{faq.que}</td>
              <td>{faq.ans}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(faq._id)}
                >
                  Delete
                </button>
              </td>
           
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
