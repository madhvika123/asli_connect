import React, { useState } from "react";
import { Image, Modal, message, Space, Button, Tooltip } from "antd";
import {
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  EyeOutlined,
  CopyOutlined,
} from "@ant-design/icons";

/**
 * Validate if a URL is valid
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL is valid
 */
const isValidUrl = (url) => {
  if (!url || typeof url !== "string") return false;

  // Remove whitespace
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return false;

  try {
    // Try to create a URL object
    const urlObj = new URL(trimmedUrl);

    // Check if protocol is http or https
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }

    // Check if hostname exists
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return false;
    }

    return true;
  } catch (error) {
    // If URL constructor throws, it's invalid
    return false;
  }
};

/**
 * Check if URL is accessible (async check)
 * @param {string} url - URL to check
 * @returns {Promise<boolean>} - True if URL is accessible
 */
const isUrlAccessible = async (url) => {
  if (!isValidUrl(url)) return false;

  try {
    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors", // Avoid CORS issues, but we can't check status
    });
    // With no-cors, we can't check status, so we assume it's accessible
    // if no error is thrown
    return true;
  } catch (error) {
    // Try with GET request as fallback for CORS-enabled resources
    try {
      const img = new Image();
      return new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        // Timeout after 3 seconds
        setTimeout(() => resolve(false), 3000);
      });
    } catch {
      return false;
    }
  }
};

/**
 * Filter out invalid URLs from an array
 * @param {Array<string>} urls - Array of URLs to filter
 * @param {boolean} checkAccessibility - Whether to check if URLs are accessible (async)
 * @returns {Promise<Array<string>>} - Filtered array of valid URLs
 */
export const filterValidUrls = async (urls, checkAccessibility = false) => {
  if (!Array.isArray(urls)) return [];

  // First filter by URL format validation
  const validFormatUrls = urls.filter((url) => isValidUrl(url));

  if (!checkAccessibility) {
    return validFormatUrls;
  }

  // Check accessibility for each URL
  const accessibilityChecks = await Promise.all(
    validFormatUrls.map((url) => isUrlAccessible(url))
  );

  return validFormatUrls.filter((_, index) => accessibilityChecks[index]);
};

/**
 * Synchronously filter invalid URLs (format only, no accessibility check)
 * @param {Array<string>} urls - Array of URLs to filter
 * @returns {Array<string>} - Filtered array of valid URLs
 */
export const filterValidUrlsSync = (urls) => {
  if (!Array.isArray(urls)) return [];
  return urls.filter((url) => isValidUrl(url));
};

/**
 * Utility function to detect file type from URL
 */
const getFileType = (url) => {
  if (!url || !isValidUrl(url)) return "unknown";

  const extension = url.split(".").pop()?.toLowerCase().split("?")[0];

  const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
  const documentTypes = {
    pdf: "pdf",
    doc: "word",
    docx: "word",
    xls: "excel",
    xlsx: "excel",
    txt: "text",
    csv: "csv",
  };

  if (imageTypes.includes(extension)) return "image";
  if (documentTypes[extension]) return documentTypes[extension];
  return "document";
};

/**
 * Get appropriate icon for file type
 */
const getFileIcon = (fileType, size = 24) => {
  const iconStyle = { fontSize: size, color: "#1890ff" };

  switch (fileType) {
    case "pdf":
      return <FilePdfOutlined style={{ ...iconStyle, color: "#ff4d4f" }} />;
    case "word":
      return <FileWordOutlined style={{ ...iconStyle, color: "#1890ff" }} />;
    case "excel":
      return <FileExcelOutlined style={{ ...iconStyle, color: "#52c41a" }} />;
    case "text":
    case "csv":
      return <FileTextOutlined style={iconStyle} />;
    case "image":
      return <FileImageOutlined style={iconStyle} />;
    default:
      return <FileTextOutlined style={iconStyle} />;
  }
};

/**
 * Get file name from URL
 */
const getFileName = (url) => {
  if (!url) return "Document";
  try {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1].split("?")[0];
    return decodeURIComponent(fileName);
  } catch {
    return "Document";
  }
};

/**
 * Copy URL to clipboard
 */
const copyToClipboard = async (url) => {
  try {
    await navigator.clipboard.writeText(url);
    message.success("Link copied to clipboard!");
  } catch (err) {
    message.error("Failed to copy link");
  }
};

/**
 * Share file using Web Share API or fallback to copy
 */
const shareFile = async (url, fileName) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: fileName || "Document",
        text: "Check out this document",
        url: url,
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        copyToClipboard(url);
      }
    }
  } else {
    copyToClipboard(url);
  }
};

/**
 * Download file
 */
const downloadFile = (url, fileName) => {
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || getFileName(url);
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Download started");
  } catch (err) {
    window.open(url, "_blank");
    message.info("Opening in new tab");
  }
};

/**
 * Single Document/Image Viewer Component
 */
export const DocumentItem = ({
  url,
  fileName,
  size = "medium",
  showActions = true,
  isSingleDocument = false,
  onView,
  onDownload,
  onShare,
}) => {
  const fileType = getFileType(url);
  const displayName = fileName || getFileName(url);
  const isImage = fileType === "image";

  const sizeMap = {
    small: { width: 60, height: 60, iconSize: 20 },
    medium: { width: 100, height: 100, iconSize: 32 },
    large: { width: 150, height: 150, iconSize: 48 },
  };

  const dimensions = sizeMap[size] || sizeMap.medium;

  // For single document images, use natural aspect ratio instead of square
  const imageContainerStyle =
    isSingleDocument && isImage
      ? {
          width: "auto",
          maxWidth: "100%",
          height: "auto",
          maxHeight: "400px",
          minWidth: dimensions.width,
          minHeight: dimensions.height,
        }
      : {
          width: dimensions.width,
          height: dimensions.height,
        };

  const imageStyle =
    isSingleDocument && isImage
      ? {
          width: "auto",
          height: "auto",
          maxWidth: "100%",
          maxHeight: "400px",
          objectFit: "contain",
        }
      : {
          width: "100%",
          height: "100%",
          objectFit: "cover",
        };

  const handleView = () => {
    if (onView) {
      onView(url);
    } else if (isImage) {
      // Open image in modal
      const modalWidth = isSingleDocument ? "auto" : "80%";
      Modal.info({
        title: displayName,
        width: modalWidth,
        content: (
          <Image
            src={url}
            alt={displayName}
            style={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }}
          />
        ),
        okText: "Close",
        style: isSingleDocument ? { maxWidth: "90vw" } : {},
      });
    } else {
      window.open(url, "_blank");
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(url, displayName);
    } else {
      downloadFile(url, displayName);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(url, displayName);
    } else {
      shareFile(url, displayName);
    }
  };

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "8px",
        padding: "8px",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
        position: "relative",
        maxWidth: isSingleDocument && isImage ? "100%" : dimensions.width + 20,
      }}
    >
      {isImage ? (
        <div
          style={{
            ...imageContainerStyle,
            overflow: "hidden",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
          }}
          onClick={handleView}
        >
          <img
            src={url}
            alt={displayName}
            style={imageStyle}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = getFileIcon(
                fileType,
                dimensions.iconSize
              );
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: dimensions.width,
            height: dimensions.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
            border: "1px solid #e8e8e8",
          }}
          onClick={handleView}
        >
          {getFileIcon(fileType, dimensions.iconSize)}
        </div>
      )}

      {showActions && (
        <Space
          size="small"
          style={{
            marginTop: "8px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Tooltip title="View">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={handleView}
            />
          </Tooltip>
          <Tooltip title="Download">
            <Button
              type="text"
              size="small"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
            />
          </Tooltip>
          <Tooltip title="Share">
            <Button
              type="text"
              size="small"
              icon={<ShareAltOutlined />}
              onClick={handleShare}
            />
          </Tooltip>
          <Tooltip title="Copy Link">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(url)}
            />
          </Tooltip>
        </Space>
      )}

      <div
        style={{
          marginTop: "4px",
          fontSize: "12px",
          textAlign: "center",
          maxWidth: dimensions.width + 20,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: "#666",
        }}
        title={displayName}
      >
        {displayName}
      </div>
    </div>
  );
};

/**
 * Document Gallery Component - Displays multiple documents/images
 */
const DocumentViewer = ({
  documents = [],
  size = "medium",
  showActions = true,
  maxDisplay = null,
  onView,
  onDownload,
  onShare,
  emptyMessage = "No documents available",
  filterInvalidUrls = true,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Filter out invalid URLs
  const validDocuments = filterInvalidUrls
    ? filterValidUrlsSync(Array.isArray(documents) ? documents : [documents])
    : Array.isArray(documents)
    ? documents
    : [documents];

  if (!validDocuments || validDocuments.length === 0) {
    return (
      <div style={{ padding: "16px", textAlign: "center", color: "#999" }}>
        {emptyMessage}
      </div>
    );
  }

  const displayDocs = maxDisplay
    ? validDocuments.slice(0, maxDisplay)
    : validDocuments;
  const remainingCount = maxDisplay ? validDocuments.length - maxDisplay : 0;
  const isSingleDocument = validDocuments.length === 1;

  // Calculate dynamic modal width based on document count
  const getModalWidth = () => {
    if (validDocuments.length === 1) return "auto";
    if (validDocuments.length <= 3) return "60%";
    if (validDocuments.length <= 6) return "70%";
    return "80%";
  };

  const handleImagePreview = (url, fileName) => {
    setPreviewImage(url);
    setPreviewTitle(fileName || getFileName(url));
    setPreviewVisible(true);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          padding: "8px",
        }}
      >
        {displayDocs.map((url, index) => {
          const fileType = getFileType(url);
          const fileName = getFileName(url);
          const isImage = fileType === "image";

          return (
            <DocumentItem
              key={index}
              url={url}
              fileName={fileName}
              size={size}
              showActions={showActions}
              isSingleDocument={isSingleDocument}
              onView={
                isImage ? () => handleImagePreview(url, fileName) : onView
              }
              onDownload={onDownload}
              onShare={onShare}
            />
          );
        })}

        {remainingCount > 0 && (
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "8px",
              padding: "8px",
              border: "1px dashed #d9d9d9",
              borderRadius: "8px",
              width: size === "small" ? 60 : size === "large" ? 150 : 100,
              height: size === "small" ? 60 : size === "large" ? 150 : 100,
              color: "#999",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            +{remainingCount} more
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={getModalWidth()}
        centered
        style={isSingleDocument ? { maxWidth: "90vw" } : {}}
      >
        <Image
          src={previewImage}
          alt={previewTitle}
          style={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }}
        />
      </Modal>
    </>
  );
};

export default DocumentViewer;

// Export utility functions
export {
  getFileType,
  getFileIcon,
  getFileName,
  copyToClipboard,
  shareFile,
  downloadFile,
  isValidUrl,
};

/**
 * Helper function to create a render function for table columns
 * Usage in table columns:
 * {
 *   title: "Documents",
 *   dataIndex: "documents",
 *   render: createDocumentRenderer({ size: "small", maxDisplay: 3 })
 * }
 *
 * @param {Object} options - Configuration options
 * @param {string} options.size - Size of document items: "small", "medium", "large"
 * @param {number} options.maxDisplay - Maximum number of documents to display
 * @param {boolean} options.showActions - Show action buttons (view, download, share)
 * @returns {Function} - Render function for table column
 */
export const createDocumentRenderer = (options = {}) => {
  const {
    size = "small",
    maxDisplay = 3,
    showActions = true,
    filterInvalidUrls = true,
  } = options;

  return (documents) => {
    if (!documents || documents.length === 0) {
      return <span style={{ color: "#999" }}>No documents</span>;
    }

    // Filter invalid URLs before passing to DocumentViewer
    const validDocs = filterInvalidUrls
      ? filterValidUrlsSync(Array.isArray(documents) ? documents : [documents])
      : Array.isArray(documents)
      ? documents
      : [documents];

    if (validDocs.length === 0) {
      return <span style={{ color: "#999" }}>No valid documents</span>;
    }

    return (
      <DocumentViewer
        documents={validDocs}
        size={size}
        maxDisplay={maxDisplay}
        showActions={showActions}
        filterInvalidUrls={filterInvalidUrls}
      />
    );
  };
};

/**
 * Custom hook for document button with modal viewer
 * Returns a render function for table columns and a modal component
 *
 * Usage:
 * const { renderDocuments, DocumentModal } = useDocumentButton();
 *
 * In table columns:
 * {
 *   title: "Documents",
 *   dataIndex: "documents",
 *   render: renderDocuments
 * }
 *
 * In JSX:
 * <DocumentModal />
 *
 * @param {Object} options - Configuration options
 * @param {string} options.buttonText - Custom button text (default: "View")
 * @param {string} options.emptyText - Text when no documents (default: "No documents")
 * @param {string} options.modalTitle - Modal title (default: "View Documents")
 * @param {string} options.size - Document size in modal: "small", "medium", "large"
 * @param {boolean} options.showActions - Show action buttons in modal
 * @param {boolean} options.filterInvalidUrls - Filter invalid URLs
 * @returns {Object} - { renderDocuments: Function, DocumentModal: React.Component }
 */
export const useDocumentButton = (options = {}) => {
  const {
    buttonText = "View",
    emptyText = "No documents",
    modalTitle = "View Documents",
    size = "medium",
    showActions = true,
    filterInvalidUrls = true,
  } = options;

  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const renderDocuments = (documents) => {
    const validDocs = filterInvalidUrls
      ? filterValidUrlsSync(Array.isArray(documents) ? documents : [])
      : Array.isArray(documents)
      ? documents
      : [];

    if (!validDocs || validDocs.length === 0) {
      return <span style={{ color: "#999" }}>{emptyText}</span>;
    }

    return (
      <Button
        type="link"
        icon={<FileImageOutlined />}
        onClick={() => {
          setSelectedDocuments(validDocs);
          setDocumentModalVisible(true);
        }}
      >
        {buttonText} ({validDocs.length})
      </Button>
    );
  };

  // Calculate dynamic modal width based on document count
  const getModalWidth = () => {
    if (selectedDocuments.length === 1) return "auto";
    if (selectedDocuments.length <= 3) return "60%";
    if (selectedDocuments.length <= 6) return "70%";
    return "80%";
  };

  const DocumentModal = () => (
    <Modal
      title={modalTitle}
      open={documentModalVisible}
      onCancel={() => {
        setDocumentModalVisible(false);
        setSelectedDocuments([]);
      }}
      footer={[
        <Button
          key="close"
          onClick={() => {
            setDocumentModalVisible(false);
            setSelectedDocuments([]);
          }}
        >
          Close
        </Button>,
      ]}
      width={getModalWidth()}
      centered
      style={selectedDocuments.length === 1 ? { maxWidth: "90vw" } : {}}
    >
      <DocumentViewer
        documents={selectedDocuments}
        size={size}
        showActions={showActions}
        emptyMessage={emptyText}
        filterInvalidUrls={filterInvalidUrls}
      />
    </Modal>
  );

  return { renderDocuments, DocumentModal };
};
