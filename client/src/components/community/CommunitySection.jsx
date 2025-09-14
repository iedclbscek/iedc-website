const CommunitySection = ({ title, content, type = 'text' }) => {
  if (!content || (Array.isArray(content) && content.length === 0)) {
    return null;
  }

  const renderContent = () => {
    switch (type) {
      case 'list':
        return (
          <ul className="list-disc list-inside text-text-light space-y-2 mb-6">
            {content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      
      case 'cards':
        return (
          <div className="grid grid-cols-1 gap-4 mb-6">
            {content.items.map((item, index) => (
              <div key={index} className="bg-primary/10 rounded-lg p-4">
                <h3 className="font-semibold text-text-dark mb-2">{item.name}</h3>
                <p className="text-text-light">{item.description}</p>
              </div>
            ))}
          </div>
        );
      
      case 'highlight':
        return (
          <div className="bg-accent/10 rounded-lg p-6 mb-6">
            <p className="text-text-dark">{content}</p>
          </div>
        );
      
      default:
        return <p className="text-text-light mb-6">{content}</p>;
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-text-dark mb-4">{title}</h2>
      {renderContent()}
    </>
  );
};

export default CommunitySection;
