import PostLayout from '@/components/PostLayout';
import Image from 'next/image';

export default function Post() {
  return (
    <PostLayout
      title="Best Choices"
      date="2025-11-13 19:20:00 +0800"
      categories={['Diary']}
    >
      <p>笔记本就是苹果，架构就是arm，台式机就是linux，耳机就是索尼，游戏引擎就是unreal，服务就是谷歌，开源就是kitware，图形接口就是WebGPU，编程就是cpp，计算就是sycl，存数据就是HDF5，买东西就去拼多多，看书就是zlibrary，吃药就吃阿比特龙，直播就看户晨风，看报就看联合早报，美国总统就选纽森，工作地点就选新加坡。我看最近那，我自己制作我的图片啊，就是周围贴上谷歌，苹果，kitware，户晨风等的标志。那我觉得挺好的，因为你普通人，选这些你是一点坑都没有的，你一定不会吃亏的，如果我给你推荐杂七杂八的选择，你去吃亏了，你不回头骂我是不是。所以生活中一定要找真正好的品牌，真正好的信息渠道。否则你的生活成本不但会高，而且会跟碰到屎一样难受。</p>
      
      <p>If you’re using a laptop, it should be Apple.<br />
      If you are choosing architecture, it should be ARM.<br />
      If you are using a desktop, then Linux.<br />
      For headphones, always Sony.<br />
      For game engines, Unreal.<br />
      For services, Google.<br />
      For open source, Kitware.<br />
      For graphics interfaces, WebGPU.<br />
      For programming, cpp.<br />
      For computing, SYCL.<br />
      For data storage, HDF5.<br />
      For shopping, go to Pinduoduo.<br />
      For books, Z-Library.<br />
      For medicine, take Abiraterone.<br />
      For live streams, watch Hu Chenfeng.<br />
      For news, read Lianhe Zaobao.<br />
      For U.S. President, vote for Gavin Newsom.<br />
      For work, choose Singapore.</p>
      
      <p>Recently, I’ve been making my own image — surrounded by the logos of Google, Apple, Kitware, Hu Chenfeng, and others. I think that looks great, because for ordinary people, choosing these means you’ll never be wrong — you won’t get burned. If I recommended a bunch of random options and you ended up suffering for it, you’d probably blame me, right?</p>
      
      <p>That’s why in life, you must always choose the truly good brands and the right information sources. Otherwise, your cost of living won’t just be higher — it’ll feel like stepping in shit.</p>
      
      <div className="my-8">
        <Image 
          src="https://picsum.photos/seed/brands/1200/800" 
          alt="Brands" 
          width={1200} 
          height={800} 
          className="rounded-xl shadow-sm"
          referrerPolicy="no-referrer"
        />
      </div>
    </PostLayout>
  );
}
