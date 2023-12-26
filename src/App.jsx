import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

function usePagination(totalRows, pageSize) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const pagesCount = Math.ceil(totalRows / pageSize);

  return {
    currentPage,
    pagesCount,
    handlePageChange,
  };
}

function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationData, setPaginationData] = useState({ totalRows: 0 });

  const columns = [
        { name: 'Name', selector: row => row.name, sortable: true ,  cell: row => (
          <td className=" text-blue-600 font-bold">
            {row.name}
          </td>
        ), },
        { name: 'Email', selector: row => row.email, sortable: true ,  cell: row => (
          <td className=" text-blue-600 font-bold">
            {row.email}
          </td>
        )},

        { name: 'Country', selector: row => row.country, sortable: true ,  cell: row => (
          <td className=" text-blue-600 font-bold">
            {row.country}
          </td>
        )},
        { name: 'Representative', selector: row => row.representative, sortable: true ,  cell: row => (
          <td className=" text-red-700 font-bold">
            {row.representative}
          </td>
        )},
        { name: 'Status', selector: row => row.status, sortable: true ,  cell: row => (
          <td className=" text-blue-600 font-bold">
            {row.status}
          </td>
        )},
        { name: 'Activity', selector: row => row.activity, sortable: true ,  cell: row => (
          <td className=" text-blue-600 font-bold">
            {row.activity}
          </td>
        )},
        {
          name: 'Actions',
          cell: (row) => (
            <button className='bg-black rounded-md text-white font-semibold p-2'  onClick={() => handleDelete(row.id)}>Delete For Now</button>
          )
        }
      ];

  const handleDelete = async (id) => {
            try {
              // Perform the actual deletion on the server
              const response = await fetch(`http://localhost:3000/users/${id}`, {
                method: 'DELETE'
              });
        
              if (response.ok) {
                // Update the local state
                setUsers(users.filter(user => user.id !== id));
                // Display a success message to the user
                alert('User deleted successfully!');
              } else {
                // Handle deletion error
                console.error('Error deleting user:', response.statusText);
             
                alert('Error deleting user. Please try again.');
              }
            } catch (error) {
              console.error('Error during deletion:', error);
             
              alert('An error occurred while deleting the user.');
            }
          };

          useEffect(() => {
            const fetchUsers = async () => {
              try {
                const response = await fetch(`http://localhost:3000/users`);
                const data = await response.json();
                setUsers(data);
                setPaginationData({ totalRows: data.length });
              } catch (error) {
                setError(error);
              } finally {
                setIsLoading(false);
              }
            };
        
            fetchUsers();
          }, []);


          const filteredUsers = users.filter(user => {
                const searchText = searchTerm.toLowerCase();
                return (
                  user.name.toLowerCase().includes(searchText) ||
                  user.email.toLowerCase().includes(searchText) ||
                  user.country.toLowerCase().includes(searchText) ||
                  user.representative.toLowerCase().includes(searchText) ||
                  user.status.toLowerCase().includes(searchText) ||
                  user.activity.toLowerCase().includes(searchText)
                );
              });

          const { currentPage, pagesCount, handlePageChange } = usePagination(
                paginationData.totalRows,
                10
              );
            
          const options = {
                pageSize: 10,
                globalSearch: true,
                pagination: true,
                sorting: true,
                page: currentPage,
                onPageChange: handlePageChange,
              };
            
          return (
                <div className="container mx-auto p-4">
                  {isLoading && <p className="text-center">Loading Users...</p>}
                  {error && <p className="text-center text-red-600">{error.message} (Please Start Server)</p>}
                  {!isLoading && !error && (
                    <>
                      <input
                        className="w-1/4 text-yellow-600 font-bold p-3 rounded"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="  Search users..."
                      />
                      <DataTable
                        columns={columns}
                        data={filteredUsers.slice((currentPage - 1) * 10, currentPage * 10)}
                        options={options}
                      />
                       <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-1 rounded"
          >
            Previous
          </button>
          {Array.from({ length: pagesCount }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`${currentPage === index + 1 ? 'bg-blue-500 text-white m-1' : 'bg-gray-300 m-1 hover:bg-gray-400 text-gray-800'} font-bold py-2 px-4 rounded mr-2 m-1`}
            >
              {index + 1}
            </button>
          ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === pagesCount}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  m-1 rounded">Next
        </button>
        </div>
          </>
          )}
      </div>

     );
     }
            
export default App;

