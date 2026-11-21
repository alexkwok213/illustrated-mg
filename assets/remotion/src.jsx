import React from 'react';
import {AbsoluteFill,Audio,Composition,registerRoot,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import data from './example.json';

const ink='#233a35', cream='#fff8e9', green='#225b50', red='#a44130';
const clamp=x=>Math.min(1,Math.max(0,x));
const ease=x=>1-(1-clamp(x))**3;
const serif='"Songti SC","Noto Serif CJK SC",serif';
function Cup({color,scale}) {
  return <svg viewBox="0 0 200 215" width="80%" height="66%" style={{transformOrigin:'bottom',transform:'scale('+scale+')'}}>
    <ellipse cx="103" cy="198" rx="60" ry="10" fill="#38281923"/>
    <path d="M38 42 Q101 28 163 42 L146 174 Q104 191 57 175Z" fill={color}/>
    <path d="M50 85 Q100 98 157 83 L151 136 Q100 153 53 137Z" fill="#f1d6a7"/>
    <path d="M61 62 L72 169" stroke="white" opacity=".22" strokeWidth="5"/>
    <ellipse cx="101" cy="42" rx="66" ry="18" fill="#f5ead4"/>
    <ellipse cx="101" cy="42" rx="56" ry="11" fill="#573727"/>
    <ellipse cx="96" cy="40" rx="41" ry="6" fill="#af8056"/>
  </svg>;
}
function Comparison({items,scene,previous,p}) {
  const prior=previous?.type==='compare'?previous.visible:scene.visible;
  const position=(i,count)=>540+(i-(count-1)/2)*296;
  return items.slice(0,scene.visible).map((item,i)=>{
    const entering=i>=prior, focus=scene.focus===i;
    const x=position(i,prior)*(1-p)+position(i,scene.visible)*p;
    return <div key={item.label} style={{position:'absolute',left:x-139,top:590+(entering?100*(1-p):0),width:278,height:540,opacity:entering?p:1,background:focus?green:cream,color:focus?cream:ink,border:'3px solid '+ink,borderRadius:'140px 140px 12px 12px',boxShadow:'7px 10px 0 #283b3326',display:'flex',alignItems:'center',flexDirection:'column',justifyContent:'center'}}>
      {item.glyph==='cup'?<Cup color={item.color} scale={item.scale}/>:<div style={{height:255,width:54,display:'flex',alignItems:'end'}}><div style={{width:54,height:225*item.scale,background:item.color}}/></div>}
      <div style={{fontSize:33}}>{item.label}</div><b style={{fontSize:67,fontFamily:'Georgia,serif'}}>{item.value}</b><div style={{fontSize:27}}>{item.detail}</div>
    </div>;
  });
}
function Diagram({scene,age,items}) {
  const subject=items[scene.item];
  if(scene.type==='case' && subject?.glyph==='cup') {
    const p=ease(age/.65);
    return <div style={{position:'absolute',left:152,top:540,width:776,height:640,background:green,color:cream,boxShadow:'14px 18px 0 #233a352b',borderRadius:12,transform:'rotate('+(-4+2*p)+'deg) translateY('+((1-p)*48)+'px)',display:'flex',alignItems:'center',flexDirection:'column',justifyContent:'center'}}>
      <Cup color={subject.color} scale={1}/>
      <div style={{width:'84%',marginTop:15,paddingTop:20,borderTop:'3px dashed #cbbfa6',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontFamily:serif,fontSize:43}}>{scene.rows[0]}</span>
        <strong style={{fontFamily:'Georgia,serif',fontSize:70}}>{subject.value}</strong>
      </div>
    </div>;
  }
  return <div style={{position:'absolute',left:90,right:90,top:575}}>
    {scene.rows.map((row,i)=>{
      const p=ease((age-(scene.beats?.[i]??i*.4))/.45);
      return <div key={row} style={{opacity:p,transform:'translateY('+((1-p)*30)+'px)',position:'relative',marginBottom:scene.type==='path'?45:18,padding:'31px 36px',borderLeft:'10px solid '+(i===0?red:green),background:i===0?green:cream,color:i===0?cream:ink,fontSize:scene.type==='case'?58:46,boxShadow:'4px 6px 0 #233a351a'}}>
        {scene.type==='path'&&i>0&&<span style={{position:'absolute',top:-49,left:36,color:green,fontSize:40}}>↓</span>}
        {scene.type==='check'?'✓　':''}{row}
      </div>;
    })}
  </div>;
}
function Film({title,scenes,items,captions,audio}) {
  const frame=useCurrentFrame(),{fps,durationInFrames}=useVideoConfig(),t=frame/fps;
  const index=Math.max(0,scenes.findLastIndex(s=>s.start<=t)),scene=scenes[index],age=t-scene.start;
  const caption=captions.find(c=>t>=c.start&&t<c.end);
  return <AbsoluteFill style={{background:'radial-gradient(ellipse at 10% 12%,#fcf9ed,#ebe1ca)',fontFamily:'"PingFang SC","Noto Sans CJK SC",sans-serif',color:ink}}>
    <div style={{position:'absolute',top:93,left:84,right:84,fontSize:34,borderBottom:'3px solid '+ink,paddingBottom:24}}>{title}</div>
    <div style={{position:'absolute',top:182,left:84,right:84,display:'flex',gap:14}}>
      {scenes.map((s,i)=>s.chapter&&<div key={s.start} style={{flex:1,borderTop:'4px solid '+(i===index?red:'#c7bda7'),paddingTop:7,fontSize:22,color:i===index?red:ink,fontWeight:i===index?700:400}}>{s.chapter}</div>)}
    </div>
    <div style={{position:'absolute',top:263,left:83,right:70,fontFamily:serif,fontSize:87,fontWeight:800,lineHeight:1.18,whiteSpace:'pre-line',transform:'translateY('+(1-ease(age/.4))*18+'px)'}}>{scene.head}</div>
    {scene.type==='compare'?<Comparison items={items} scene={scene} previous={scenes[index-1]} p={ease(age/.7)}/>:<Diagram scene={scene} age={age} items={items}/>}
    <div style={{position:'absolute',top:1280,left:85,right:85,borderTop:'2px solid #b7ad95',paddingTop:25,color:red,fontFamily:serif,fontSize:42,fontWeight:700}}>{scene.note}</div>
    <div style={{position:'absolute',bottom:225,left:86,right:86,fontSize:46,fontWeight:600,lineHeight:1.5,textAlign:'center'}}>{caption?.text}</div>
    <div style={{position:'absolute',bottom:116,left:84,width:912,height:4,background:'#c5baa4'}}><div style={{height:4,width:(100*frame/durationInFrames)+'%',background:green}}/></div>
    {audio&&<Audio src={staticFile(audio)}/>}
  </AbsoluteFill>;
}
function Root(){return <Composition id="IllustratedMG" component={Film} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(data.duration*30)} defaultProps={data} calculateMetadata={({props})=>({durationInFrames:Math.ceil(props.duration*30)})}/>;}
registerRoot(Root);
