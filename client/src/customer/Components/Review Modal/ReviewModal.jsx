import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createNewReview } from '../../../apiManager/methods/reviewMethods';
import './ReviewModal.css';  // We'll create this CSS file next

const ReviewModal = ({ isOpen, onClose, productID, onSubmitSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Add this function to reset all states
  const resetForm = () => {
    setRating(0);
    setComment('');
    setError('');
    setIsSubmitting(false);
  };

  // Modify the close handler
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please enter a review comment');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await createNewReview(productID, rating, comment);
      onSubmitSuccess?.();
      onClose();
      setRating(0);
      setComment('');
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={handleClose} className="close-button">
          <X size={20} />
        </button>

        <h2 className="modal-title">Write a Review</h2>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`star ${star <= rating ? 'active' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
            />
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="review-submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;