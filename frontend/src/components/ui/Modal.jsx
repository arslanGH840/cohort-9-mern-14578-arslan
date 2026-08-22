function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
        {children}
      </div>
    </div>
  );
}

export default Modal;
