import { MAX_TEAM_SIZE, useTeamStore } from "@/store/team";
import TeamSlot from "./TeamSlot.component";

// [0, 1, 2, 3, 4, 5] : les six emplacements, remplis ou non.
const slots = Array.from({ length: MAX_TEAM_SIZE }, (_, index) => index);

const TeamSlots = () => {
  const team = useTeamStore((state) => state.team);
  const removeFromTeam = useTeamStore((state) => state.removeFromTeam);

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {slots.map((slot) => {
        const member = team[slot];

        return (
          <TeamSlot
            key={slot}
            member={member}
            onRemove={() => removeFromTeam(member.id)}
          />
        );
      })}
    </div>
  );
};

export default TeamSlots;
