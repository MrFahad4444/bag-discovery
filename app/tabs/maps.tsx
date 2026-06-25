import { BagCard } from "@/src/components";
import { fetchAllBags } from "@/src/functions";
import { Bag } from "@/src/types";
import { withErrorHandling } from "@/src/utils";
import { MaterialIcons } from "@expo/vector-icons";

import React, {
    useEffect,
    useState,
} from "react";

import {
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";

import MapView from "react-native-map-clustering";

import {
    Marker,
    Region,
} from "react-native-maps";

export default function Maps() {
    const [bags, setBags] =
        useState<Bag[]>([]);

    const [
        selectedBag,
        setSelectedBag,
    ] = useState<Bag | null>(
        null
    );

    /**
     * Initial region.
     */
    const initialRegion: Region =
    {
        latitude: 24.7136,
        longitude: 46.6753,

        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
    };

    /**
     * Fetch all bags.
     */
    useEffect(() => {
        loadBags();
    }, []);

    async function loadBags() {
        await withErrorHandling(
            async () => {
                const response =
                    await fetchAllBags();

                setBags(response);
            },
            "Error loading bags:"
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={
                    initialRegion
                }
                radius={40}
                clusterColor="#2563eb"
                clusterTextColor="#FFFFFF"
                animationEnabled
                spiralEnabled
            >
                {bags.map((bag) => (
                    <Marker
                        key={bag.id}
                        coordinate={{
                            latitude:
                                Number(
                                    bag.latitude
                                ),

                            longitude:
                                Number(
                                    bag.longitude
                                ),
                        }}
                        onPress={() =>
                            setSelectedBag(
                                bag
                            )
                        }
                        tracksViewChanges={
                            false
                        }
                    >

                    </Marker>
                ))}
            </MapView>

            {selectedBag && (
                <View>
                    <TouchableOpacity
                        onPress={() =>
                            setSelectedBag(
                                null
                            )
                        }
                        className="absolute top-2.5 right-2.5 z-10 w-[30px] h-[30px] rounded-full bg-gray-200 items-center justify-center mx-5 my-3"
                    >
                        <MaterialIcons
                            name="close"
                            size={20}
                            color="#111827"
                        />
                    </TouchableOpacity>

                    <BagCard
                        item={
                            selectedBag
                        }
                    />
                </View>
            )}
        </View>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
        },

        map: {
            flex: 1,
        },
    });