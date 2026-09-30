import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { QuizTimer } from '../QuizTimer';

describe('QuizTimer Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial formatted duration correctly', () => {
    render(
      <QuizTimer
        durationMinutes={10}
        onTimeExpired={jest.fn()}
        language="en"
      />
    );

    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('decrements time every second', () => {
    render(
      <QuizTimer
        durationMinutes={5}
        onTimeExpired={jest.fn()}
        language="en"
      />
    );

    expect(screen.getByText('05:00')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000); // 3 seconds
    });

    expect(screen.getByText('04:57')).toBeInTheDocument();
  });

  it('calls onTimeExpired when timer hits zero', () => {
    const handleExpired = jest.fn();
    render(
      <QuizTimer
        durationMinutes={1}
        onTimeExpired={handleExpired}
        language="en"
      />
    );

    act(() => {
      jest.advanceTimersByTime(60000); // 60 seconds
    });

    expect(handleExpired).toHaveBeenCalledTimes(1);
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('displays English warning when 3 minutes or fewer remain', () => {
    render(
      <QuizTimer
        durationMinutes={3}
        onTimeExpired={jest.fn()}
        language="en"
      />
    );

    expect(screen.getByText('Warning: Time running out')).toBeInTheDocument();
  });

  it('displays Arabic warning when 3 minutes or fewer remain in Arabic mode', () => {
    render(
      <QuizTimer
        durationMinutes={2}
        onTimeExpired={jest.fn()}
        language="ar"
      />
    );

    expect(screen.getByText('تنبيه: الوقت ينفد')).toBeInTheDocument();
  });

  it('does not tick down when isPaused is true', () => {
    render(
      <QuizTimer
        durationMinutes={10}
        onTimeExpired={jest.fn()}
        language="en"
        isPaused={true}
      />
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText('10:00')).toBeInTheDocument();
  });
});
