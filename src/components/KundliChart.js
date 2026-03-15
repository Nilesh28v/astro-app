import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Polygon, Text as SvgText } from 'react-native-svg';

const KundliChart = ({ houses, size = 300 }) => {
    const half = size / 2;
    const padding = 10;
    const innerSize = size - padding * 2;
    const center = size / 2;

    // Map planet names to 2-letter codes for the chart
    const getPlanetCode = (name) => {
        const codes = {
            Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
            Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke'
        };
        return codes[name] || name.slice(0, 2);
    };

    // Calculate house positions for labels and planets
    // North Indian Chart Structure (1st house is top diamond)
    const housePositions = [
        { x: center, y: size * 0.25 }, // 1
        { x: size * 0.25, y: size * 0.125 }, // 2
        { x: size * 0.125, y: size * 0.25 }, // 3
        { x: size * 0.25, y: size * 0.5 }, // 4
        { x: size * 0.125, y: size * 0.75 }, // 5
        { x: size * 0.25, y: size * 0.875 }, // 6
        { x: center, y: size * 0.75 }, // 7
        { x: size * 0.75, y: size * 0.875 }, // 8
        { x: size * 0.875, y: size * 0.75 }, // 9
        { x: size * 0.75, y: size * 0.5 }, // 10
        { x: size * 0.875, y: size * 0.25 }, // 11
        { x: size * 0.75, y: size * 0.125 }, // 12
    ];

    return (
        <View style={styles.container}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Border */}
                < Polygon
                    points={`0,0 ${size},0 ${size},${size} 0,${size}`}
                    fill="none"
                    stroke="#B8860B"
                    strokeWidth="2"
                />

                {/* Inner Diamonds (Main Structure) */}
                <Line x1="0" y1="0" x2={size} y2={size} stroke="#B8860B" strokeWidth="1" />
                <Line x1={size} y1="0" x2="0" y2={size} stroke="#B8860B" strokeWidth="1" />

                <Line x1={half} y1="0" x2="0" y2={half} stroke="#B8860B" strokeWidth="1" />
                <Line x1="0" y1={half} x2={half} y2={size} stroke="#B8860B" strokeWidth="1" />
                <Line x1={half} y1={size} x2={size} y2={half} stroke="#B8860B" strokeWidth="1" />
                <Line x1={size} y1={half} x2={half} y2="0" stroke="#B8860B" strokeWidth="1" />

                {/* House Numbers (Rashi numbers) and Planet Symbols */}
                {houses.map((house, idx) => {
                    const pos = housePositions[idx];
                    return (
                        <React.Fragment key={house.number}>
                            {/* Rashi Number in house corner */}
                            <SvgText
                                x={pos.x}
                                y={idx === 0 ? pos.y + 15 : pos.y}
                                fontSize="12"
                                fill="#8B6914"
                                textAnchor="middle"
                                fontWeight="bold"
                            >
                                {house.rashi}
                            </SvgText>

                            {/* Planet Codes */}
                            {house.planets.map((p, pIdx) => (
                                <SvgText
                                    key={p}
                                    x={pos.x}
                                    y={pos.y + (pIdx + 1) * 14 + (idx === 0 ? 10 : -4)}
                                    fontSize="11"
                                    fill="#1A1A1A"
                                    textAnchor="middle"
                                >
                                    {getPlanetCode(p)}
                                </SvgText>
                            ))}
                        </React.Fragment>
                    );
                })}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EBE7E0',
    },
});

export default KundliChart;
