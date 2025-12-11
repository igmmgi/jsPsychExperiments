# Image Description Script

This script analyzes all images in the `Images` folder using vision APIs (OpenAI or Cursor) and generates detailed descriptions.

## Setup

1. Install required packages:
```bash
pip install -r requirements.txt
```

2. Set your API key:

**Option A: Using OpenAI API**
```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

**Option B: Using Cursor API (uses your Cursor account's models)**
```bash
export CURSOR_API_KEY="your-cursor-api-key-here"
```

Or pass it as an argument:
```bash
python describe_images.py --api-key "your-api-key-here" --provider cursor
```

## Usage

### Basic usage (OpenAI):
```bash
python describe_images.py
```

### Using Cursor API:
```bash
python describe_images.py --provider cursor
```

### Options:
- `--api-key`: API key (OpenAI or Cursor, or set OPENAI_API_KEY/CURSOR_API_KEY env var)
- `--provider`: API provider to use: `openai` or `cursor` (default: openai)
- `--model`: Model to use (default: gpt-4o, alternatives: gpt-4-vision-preview)
- `--cursor-base-url`: Cursor API base URL (default: https://api.cursor.com/v1)
- `--output`: Output JSON file path (default: image_descriptions.json)
- `--images-dir`: Path to Images directory (default: Images)
- `--resume`: Resume from existing output file (skip already described images)

### Examples:

Process all images with OpenAI:
```bash
python describe_images.py
```

Process all images with Cursor API:
```bash
python describe_images.py --provider cursor
```

Resume processing (useful if interrupted):
```bash
python describe_images.py --resume
```

Use a different model:
```bash
python describe_images.py --model gpt-4-vision-preview
```

## Getting Your Cursor API Key

To use Cursor's API with your account's models:

1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Navigate to the "Models" section
3. Look for API key settings or generate a new API key
4. Use this key with the `--provider cursor` option

Note: Cursor's API may have different rate limits and pricing than direct OpenAI access. Check Cursor's documentation for details.

## Output

The script generates two files:

1. **image_descriptions.json**: Structured JSON with all descriptions
2. **image_descriptions.txt**: Human-readable text file with format:
   ```
   Image Name: Folie1_base.jpeg
   Description: [detailed description]
   ```

## Notes

- The script processes 120 main images (Folie1-60, base and alt versions) plus 6 practice images
- Progress is saved after each image, so you can safely interrupt and resume
- API costs: Each image requires one API call. Check OpenAI pricing for current rates.

