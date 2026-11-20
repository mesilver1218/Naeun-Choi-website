/* Research project galleries: assets/media/<project>/cover.png and 01_title.mp4, etc.
   One public GitHub tree lookup discovers every image and video, ordered numerically.
   Legacy assets/media/<project>.png and <project>_01_title.mp4 remain supported. */
(function(){
  'use strict';
  const root='assets/media/';
  const endpoint='https://api.github.com/repos/mesilver1218/Naeun-Choi-website/git/trees/main?recursive=1';
  const cacheKey='naeun-project-media-tree-v3';
  const fileExt=/\.(png|jpe?g|webp|gif|mp4|webm)$/i;
  const imageExt=/\.(png|jpe?g|webp|gif)$/i;
  let pending;
  async function getFilePaths(){
    if(!pending)pending=(async()=>{
      try{
        let cached=null;
        try{cached=JSON.parse(sessionStorage.getItem(cacheKey)||'null')}catch(e){}
        if(cached&&Array.isArray(cached.paths)&&Date.now()-cached.time<120000)return cached.paths;
        const response=await fetch(endpoint,{headers:{Accept:'application/vnd.github+json'},cache:'no-store'});
        if(!response.ok)throw Error('GitHub media listing: '+response.status);
        const result=await response.json();
        if(!Array.isArray(result.tree)||result.truncated)throw Error('Git tree unavailable or truncated');
        const paths=result.tree.filter(x=>x.type==='blob'&&x.path.startsWith(root)&&fileExt.test(x.path)).map(x=>x.path.slice(root.length));
        try{sessionStorage.setItem(cacheKey,JSON.stringify({time:Date.now(),paths}))}catch(e){}
        return paths;
      }catch(e){return null;}
    })();
    return pending;
  }
  // Curated descriptions keyed to media paths; unverified visual details are not inferred.
  const captions={
    "vla/cover.png": "LightNav-0 Human Following on the Unitree Go2 Quadruped",
    "vla/01_real_world.mp4": "Real-World LightNav-0 Human-Following Deployment on Unitree Go2",
    "go2/cover.png": "Unitree Go2 Modular Human-Following Platform",
    "go2/01_simulation.mp4": "Modular Human-Following Navigation in NVIDIA Isaac Sim",
    "go2/02_single_target_tracking.mp4": "Single-Target Tracking with the Modular Perception and Navigation Pipeline",
    "go2/03_distracted_tracking.mp4": "Human-Following Experiment with Distracting People",
    "go2/04_hardware_configuration.png": "Unitree Go2 Hardware Configuration: RGB-D Camera, LiDAR, and Onboard Compute",
    "door/cover.png": "KIST Door-Opening Perception and Navigation Experimental Setup",
    "door/01_hdl_navigation.mp4": "Indoor Navigation with HDL-Based Localization After Unstable Fast-LIO2 Relocalization",
    "door/02_moro_navigation.mp4": "MORO Mobile-Robot Navigation Demonstration",
    "door/03_pcd_to_pgm.png": "Conversion of a 3D PCD Map into a 2D Occupancy Grid Map (PGM)",
    "door/04_simulation.png": "Simulation-Based Evaluation for SLAM and Navigation",
    "door/05_real_world.png": "Indoor Real-World Evaluation of Door-Opening Navigation and Perception Components",
    "door/06_uvmap.png": "UV Map for FoundationPose Lighting Information",
    "door/07_yolo_dataset.png": "Custom Door-Handle Dataset for YOLOv7 Training",
    "door/08_yolo_precision_recall.png": "Trained YOLOv7 Precision–Recall Graph",
    "door/09_foundationpose.mp4": "FoundationPose-Based 6D Door-Handle Pose Estimation",
    "recon/cover.png": "Simulation of Uncertainty-Aware Active 3D Reconstruction",
    "recon/01_map.png": "Reconstructed Map from Active 3D Mapping Experiments",
    "recon/02_sample.png": "Sample Observations from Active 3D Reconstruction Evaluation",
    "grasp/cover.png": "Experimental Setup for Simulation Training and Real-World Validation (Sim-to-Real)",
    "grasp/01_butterwaffle.mp4": "Successful First-Trial Grasp of an Unseen Butter-Waffle Object",
    "grasp/03_hairband.mp4": "Successful First-Trial Grasp of an Unseen Hairband",
    "grasp/05_unknown_object.mp4": "Successful First-Trial Grasp of an Unseen Object",
    "grasp/07_real_mode.mp4": "Pushing Demonstration in a Cluttered-Object Scene",
    "arm/cover.png": "Embedded 1-DOF Arm Control and 2-DOF Robot Arm Simulation",
    "arm/01_initialization.mp4": "Robot Arm Initialization and Startup Demonstration",
    "arm/02_simulation.mp4": "2-DOF Robot Arm Simulation in Open Dynamics Engine (ODE)",
    "arm/03_180_degree_angle.mp4": "180-Degree Joint-Angle Command Experiment",
    "arm/04_external_force.mp4": "Robot Arm Response to an External Force",
    "factory/cover.png": "ATmega128 Embedded Smart-Factory Prototype"
  };
  function describe(path,id,folderMode){
    const leaf=path.split('/').pop();
    const dot=leaf.lastIndexOf('.');
    if(dot<1)return null;
    const stem=leaf.slice(0,dot);
    let suffix=stem;
    let cover=false;
    if(folderMode){cover=/^cover$/i.test(stem)&&imageExt.test(leaf);}
    else{
      if(stem.toLowerCase()===id.toLowerCase()){cover=imageExt.test(leaf);suffix='';}
      else if(stem.toLowerCase().startsWith(id.toLowerCase()+'_')||stem.toLowerCase().startsWith(id.toLowerCase()+'-')){
        suffix=stem.slice(id.length+1);
      }else return null;
    }
    const numbered=suffix.match(/^(\d+)(?:[-_](.*))?$/);
    const order=cover?-1:numbered?Number(numbered[1]):100000;
    const captionStem=numbered?(numbered[2]||''):suffix;
    const caption=captions[path]||(cover?'Project overview image':captionStem.replace(/[-_]+/g,' ').replace(/\b[a-z]/g,c=>c.toUpperCase()).trim()||(imageExt.test(leaf)?'Project photo':'Experiment video'));
    return {name:leaf,relative:path,kind:imageExt.test(leaf)?'image':'video',isCover:cover,order,caption};
  }
  function compare(a,b){return a.order-b.order||a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:'base'});}
  async function findFirst(base,stems){
    for(const stem of stems)for(const ext of ['png','jpg','webp','jpeg']){
      const relative=stem+'.'+ext;
      try{const r=await fetch(base+relative,{method:'HEAD'});if(r.ok)return relative}catch(e){}
    }
    return null;
  }
  async function legacyFallback(id,base){
    const nestedCover=await findFirst(base+id+'/', ['cover']);
    if(nestedCover)return [describe(id+'/'+nestedCover,id,true)];
    const oldCover=await findFirst(base,[id]);
    return oldCover?[describe(oldCover,id,false)]:[];
  }
  async function list(id,base){
    const paths=await getFilePaths();
    let media=[];
    if(paths){
      const folder=paths.filter(path=>path.startsWith(id+'/')&&path.slice(id.length+1).indexOf('/')===-1);
      const nested=folder.length>0;
      const selected=nested?folder:paths.filter(path=>!path.includes('/')&&(path.toLowerCase()===id+'.png'||path.toLowerCase()===id+'.jpg'||path.toLowerCase()===id+'.webp'||path.toLowerCase()===id+'.jpeg'||path.toLowerCase().startsWith(id+'_')||path.toLowerCase().startsWith(id+'-')));
      media=selected.map(path=>describe(path,id,nested)).filter(Boolean);
    }else{
      media=await legacyFallback(id,base);
    }
    return media.sort(compare).map(item=>({...item,src:base+item.relative.split('/').map(encodeURIComponent).join('/')}));
  }
  window.NaeunMedia={list};
})();