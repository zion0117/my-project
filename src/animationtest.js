import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const Box3D = () => {
    const refMesh = useRef();
    useFrame((state, delta) => {
        // delta - 이전 프레임과 현재 프레임 사이의 경과시간 ms
        refMesh.current.rotation.y += delta;
    });
    return (
        <>
            <directionalLight position={[1, 1, 1]} /> {/* 직사광 추가 */}
            <axesHelper />
            <mesh ref={refMesh} rotation={[0, (45 * Math.PI) / 180, 0]}>
                {/* x축으로 0도, y축으로 45도, x축으로 0도 만큼 회전해라 */}
                <boxGeometry />
                <meshStandardMaterial color={'blue'} />
            </mesh>
        </>
    );
};

export default Box3D;
