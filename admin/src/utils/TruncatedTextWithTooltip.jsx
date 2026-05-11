import React from "react";
import { Tooltip } from "antd";

/**
 * Reusable component for displaying truncated text with a tooltip showing full text on hover
 * @param {string} text - The text to display
 * @param {number} maxLength - Maximum characters to show before truncation (default: 30)
 * @param {string} placeholder - Text to show when value is empty/null (default: "N/A")
 * @param {number} tooltipMaxWidth - Maximum width of tooltip in pixels (default: 400)
 * @param {string} tooltipPadding - Padding for tooltip (default: "5px")
 * @param {boolean} showUnderline - Whether to show dotted underline on truncated text (default: true)
 * @returns {JSX.Element} - React component
 */
const TruncatedTextWithTooltip = ({
  text,
  maxLength = 30,
  placeholder = "N/A",
  tooltipMaxWidth = 400,
  tooltipPadding = "5px",
  showUnderline = true,
}) => {
  const displayText = text || placeholder;
  const truncatedText =
    displayText.length > maxLength
      ? `${displayText.substring(0, maxLength)}...`
      : displayText;

  // If text is placeholder or doesn't need truncation, return simple span
  if (displayText === placeholder || displayText.length <= maxLength) {
    return <span>{displayText}</span>;
  }

  return (
    <Tooltip
      title={
        <div
          style={{
            color: "#000",
            maxWidth: `${tooltipMaxWidth}px`,
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {displayText}
        </div>
      }
      overlayStyle={{
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        padding: tooltipPadding,
        borderRadius: "4px",
      }}
      overlayInnerStyle={{
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      <span
        style={{
          cursor: "pointer",
          textDecoration: showUnderline ? "underline" : "none",
          textDecorationStyle: showUnderline ? "dotted" : "none",
        }}
      >
        {truncatedText}
      </span>
    </Tooltip>
  );
};

export default TruncatedTextWithTooltip;

/**
 * Helper function to create a render function for table columns
 * Usage in table columns:
 * {
 *   title: "Description",
 *   dataIndex: "description",
 *   render: createTruncatedTextRenderer({ maxLength: 30 })
 * }
 *
 * @param {Object} options - Configuration options
 * @param {number} options.maxLength - Maximum characters before truncation
 * @param {string} options.placeholder - Placeholder text for empty values
 * @param {number} options.tooltipMaxWidth - Tooltip max width in pixels
 * @param {string} options.tooltipPadding - Tooltip padding
 * @param {boolean} options.showUnderline - Show dotted underline
 * @returns {Function} - Render function for table column
 */
export const createTruncatedTextRenderer = (options = {}) => {
  return (text) => <TruncatedTextWithTooltip text={text} {...options} />;
};
