
Donationcard2= ({ item}) => {
    return (
      <div className="cards">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.title} className="cards-image" />
        )}
        <h3 className="cards-title">{item.title}</h3>
      </div>
    );
  };
 export default Donationcard2;