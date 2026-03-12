import PostLayout from '@/components/PostLayout';
import CodeBlock from '@/components/CodeBlock';
import Math from '@/components/Math';

export default function Post() {
  return (
    <PostLayout
      title="Hello World"
      date="2025-06-25 00:00:00 +0800"
      isHighlight={false}
    >
      <h2>Hello World</h2>
      <p>my first post.<br />试一下中文</p>
      
      <p>test latex formula</p>
      <Math math="\int_1^2 \sin(x) dx" block />
      
      <p>test code blocks</p>
      <CodeBlock language="python" code={`print("Hello World")`} />
      <CodeBlock language="cpp" code={`#include <iostream>

int main() {
    std::cout << "Hello World" << std::endl;
    return 0;
}`} />
    </PostLayout>
  );
}
