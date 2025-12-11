#!/usr/bin/env python3
"""
Script to describe all images in the Images folder using a vision API.
Supports OpenAI GPT-4 Vision API and Cursor API.
"""

import os
import json
import base64
from pathlib import Path
from typing import List, Dict
import argparse
import requests

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("Warning: openai package not installed. Install with: pip install openai")


def encode_image(image_path: str) -> str:
    """Encode image to base64 string."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


def describe_image_openai(image_path: str, client: OpenAI, model: str = "gpt-4o") -> str:
    """Describe an image using OpenAI's vision API."""
    base64_image = encode_image(image_path)
    
    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe this image in detail. Provide a comprehensive description including the main subject, environment, colors, composition, and any notable features. Use negation when relevant (e.g., 'no water in the pool', 'no crown on the pineapple'). Format your response as a clear, structured description."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        max_tokens=500
    )
    
    return response.choices[0].message.content


def describe_image_cursor(image_path: str, api_key: str, base_url: str = "https://api.cursor.com/v1") -> str:
    """Describe an image using Cursor's API."""
    base64_image = encode_image(image_path)
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "gpt-4o",  # Cursor typically uses GPT-4o for vision
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe this image in detail. Provide a comprehensive description including the main subject, environment, colors, composition, and any notable features. Use negation when relevant (e.g., 'no water in the pool', 'no crown on the pineapple'). Format your response as a clear, structured description."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 500
    }
    
    response = requests.post(
        f"{base_url}/chat/completions",
        headers=headers,
        json=payload
    )
    response.raise_for_status()
    
    return response.json()["choices"][0]["message"]["content"]


def get_all_images(images_dir: str) -> List[Dict[str, str]]:
    """Get all image files from the Images directory."""
    images = []
    images_path = Path(images_dir)
    
    # Main images (Folie1_base.jpeg through Folie60_alt.jpeg)
    for i in range(1, 61):
        base_path = images_path / f"Folie{i}_base.jpeg"
        alt_path = images_path / f"Folie{i}_alt.jpeg"
        
        if base_path.exists():
            images.append({
                "name": f"Folie{i}_base.jpeg",
                "path": str(base_path),
                "type": "base",
                "number": i
            })
        
        if alt_path.exists():
            images.append({
                "name": f"Folie{i}_alt.jpeg",
                "path": str(alt_path),
                "type": "alt",
                "number": i
            })
    
    # Practice images
    practice_dir = images_path / "practice"
    if practice_dir.exists():
        for i in range(1, 4):
            base_path = practice_dir / f"practice{i}_base.jpg"
            alt_path = practice_dir / f"practice{i}_alt.jpg"
            
            if base_path.exists():
                images.append({
                    "name": f"practice/practice{i}_base.jpg",
                    "path": str(base_path),
                    "type": "base",
                    "number": f"practice{i}"
                })
            
            if alt_path.exists():
                images.append({
                    "name": f"practice/practice{i}_alt.jpg",
                    "path": str(alt_path),
                    "type": "alt",
                    "number": f"practice{i}"
                })
    
    return sorted(images, key=lambda x: (str(x["number"]), x["type"]))


def main():
    parser = argparse.ArgumentParser(description="Describe all images in the Images folder")
    parser.add_argument(
        "--api-key",
        type=str,
        help="API key (OpenAI or Cursor, or set OPENAI_API_KEY/CURSOR_API_KEY environment variable)",
        default=None
    )
    parser.add_argument(
        "--model",
        type=str,
        default="gpt-4o",
        help="Model to use (default: gpt-4o)"
    )
    parser.add_argument(
        "--provider",
        type=str,
        choices=["openai", "cursor"],
        default="openai",
        help="API provider to use: 'openai' or 'cursor' (default: openai)"
    )
    parser.add_argument(
        "--cursor-base-url",
        type=str,
        default="https://api.cursor.com/v1",
        help="Cursor API base URL (default: https://api.cursor.com/v1)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="image_descriptions.json",
        help="Output JSON file path (default: image_descriptions.json)"
    )
    parser.add_argument(
        "--images-dir",
        type=str,
        default="Images",
        help="Path to Images directory (default: Images)"
    )
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Resume from existing output file (skip already described images)"
    )
    
    args = parser.parse_args()
    
    # Get API key based on provider
    if args.provider == "cursor":
        api_key = args.api_key or os.getenv("CURSOR_API_KEY")
        if not api_key:
            print("Error: Cursor API key required.")
            print("Set CURSOR_API_KEY environment variable or use --api-key argument")
            print("\nTo get your Cursor API key:")
            print("1. Open Cursor Settings")
            print("2. Go to 'Models' section")
            print("3. Find your API key or generate one")
            return 1
    else:
        api_key = args.api_key or os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("Error: OpenAI API key required.")
            print("Set OPENAI_API_KEY environment variable or use --api-key argument")
            return 1
        
        if not OPENAI_AVAILABLE:
            print("Error: openai package not installed.")
            print("Install with: pip install openai")
            return 1
    
    # Initialize client/provider
    if args.provider == "cursor":
        print(f"Using Cursor API (base URL: {args.cursor_base_url})")
        client = None  # We'll use requests directly
    else:
        print(f"Using OpenAI API (model: {args.model})")
        client = OpenAI(api_key=api_key)
    
    # Get all images
    images = get_all_images(args.images_dir)
    print(f"Found {len(images)} images to process")
    
    # Load existing descriptions if resuming
    existing_descriptions = {}
    if args.resume and os.path.exists(args.output):
        with open(args.output, 'r') as f:
            existing_descriptions = json.load(f)
        print(f"Loaded {len(existing_descriptions)} existing descriptions")
    
    # Process images
    descriptions = existing_descriptions.copy()
    
    for idx, image_info in enumerate(images, 1):
        image_name = image_info["name"]
        
        # Skip if already described
        if image_name in descriptions:
            print(f"[{idx}/{len(images)}] Skipping {image_name} (already described)")
            continue
        
        print(f"[{idx}/{len(images)}] Processing {image_name}...")
        
        try:
            if args.provider == "cursor":
                description = describe_image_cursor(image_info["path"], api_key, args.cursor_base_url)
            else:
                description = describe_image_openai(image_info["path"], client, args.model)
            
            descriptions[image_name] = {
                "description": description,
                "type": image_info["type"],
                "number": str(image_info["number"])
            }
            
            # Save progress after each image
            with open(args.output, 'w') as f:
                json.dump(descriptions, f, indent=2)
            
            print(f"  ✓ Described {image_name}")
            
        except Exception as e:
            print(f"  ✗ Error processing {image_name}: {e}")
            descriptions[image_name] = {
                "description": f"ERROR: {str(e)}",
                "type": image_info["type"],
                "number": str(image_info["number"])
            }
    
    # Generate text output
    text_output = args.output.replace('.json', '.txt')
    with open(text_output, 'w') as f:
        f.write("Image Descriptions\n")
        f.write("=" * 80 + "\n\n")
        
        for image_name in sorted(descriptions.keys()):
            info = descriptions[image_name]
            f.write(f"Image Name: {image_name}\n")
            f.write(f"Description: {info['description']}\n")
            f.write("\n" + "-" * 80 + "\n\n")
    
    print(f"\n✓ Complete! Descriptions saved to:")
    print(f"  - JSON: {args.output}")
    print(f"  - Text: {text_output}")
    
    return 0


if __name__ == "__main__":
    exit(main())

